import { promisify } from 'util';
import { exec } from 'child_process';
import { resolve, join } from 'path';
import { text, intro, outro, select, spinner, cancel, isCancel, confirm } from '@clack/prompts';
import { rmSync, mkdirSync, unlinkSync, readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'fs';

const execAsync = promisify( exec );

const args = process.argv.slice(2);
console.log();

intro('create vite-svelte + navigator');

// Detect and get project name
let PROJECT_NAME = args.find( r => !r.startsWith('--') );
if ( PROJECT_NAME === '.' ? false : ( /\s/.test( PROJECT_NAME! ) || !/^[a-zA-Z0-9-_]+$/.test( PROJECT_NAME! ) ) ) {
    PROJECT_NAME = undefined;
}
if ( !PROJECT_NAME ) {
    PROJECT_NAME = await text({
        message: 'Project name',
        placeholder: 'my-svelte-app',
        validate( value ) {
            if ( !value ) return 'Project name is required';
            if ( value !== '.' && /\s/.test(value) ) return 'Project name must not contain spaces';
            if ( value !== '.' && !/^[a-zA-Z0-9-_]+$/.test(value) ) return 'Only letters, numbers, - and _ are allowed';
        }
    }) as string;
    if ( isCancel( PROJECT_NAME ) ) {
        cancel('Operation cancelled');
        process.exit(0);
    }
}
if (
    existsSync( PROJECT_NAME ) &&
    statSync( PROJECT_NAME ).isDirectory() &&
    readdirSync( PROJECT_NAME ).length !== 0
) {
    const isClean = await confirm({ message: `Directory "${ PROJECT_NAME }" is not empty. Delete all files and continue?` });
    if ( isCancel( isClean ) || !isClean ) {
        cancel('Operation cancelled');
        process.exit(0);
    }
}
if ( PROJECT_NAME === "." ) {
    for ( const item of readdirSync( PROJECT_NAME ) ) {
        rmSync( join( PROJECT_NAME, item ), {
            recursive: true,
            force: true
        });
    }
} else {
    rmSync( PROJECT_NAME, {
        recursive: true,
        force: true
    });
}

// Detect and get project language
type Language = 'ts' | 'js';
function parseLanguageFlags(): Language | undefined {
    const flags = new Set( args );
    const hasTS = flags.has('--ts') || flags.has('--typescript');
    const hasJS = flags.has('--js') || flags.has('--javascript');
    if ( hasTS && !hasJS ) return 'ts';
    if ( hasJS && !hasTS ) return 'js';
}
let PROJECT_LANG = parseLanguageFlags();
if ( !PROJECT_LANG ) {
    PROJECT_LANG = await select({
        message: 'Select language',
        options: [
            { value: 'ts', label: 'TypeScript' },
            { value: 'js', label: 'JavaScript' }
        ]
    }) as Language;
    if ( isCancel( PROJECT_LANG ) ) {
        cancel('Operation cancelled');
        process.exit(0);
    }
}

// Detect and get package manager
function detectPackageManager(): string {
    if ( typeof ( globalThis as any ).Bun !== 'undefined' ) {
        return 'bun';
    }
    const ua = process.env.npm_config_user_agent ?? '';
    if ( ua.startsWith('pnpm') ) return 'pnpm';
    if ( ua.startsWith('yarn') ) return 'yarn';
    if ( ua.startsWith('npm') ) return 'npm';
    return 'npm';
}
let PROJECT_MANAGER = detectPackageManager();

// Create project
function fixSvelteAssetPath( file: string, replaces: { from: string, to: string }[], save: string ) {
    let content = readFileSync( resolve( file ), 'utf8' );
    for ( const replace of replaces ) {
        content = content.replace( replace.from, replace.to );
    }
    writeFileSync( resolve( save ), content, 'utf8' );
    unlinkSync( resolve( file ) );
}
const promise_crt = spinner();
promise_crt.start('Creating project...');
try {
    const paths = PROJECT_NAME === '.' ? './' : './' + PROJECT_NAME;
    await execAsync( `${ PROJECT_MANAGER } create vite@latest ${ PROJECT_NAME } ${ PROJECT_MANAGER === 'npm' ? '-- ' : '' }--template svelte${ PROJECT_LANG === 'ts' ? '-ts' : '' } --no-rolldown --no-interactive` );
    mkdirSync( `${ paths }/src/pages` );
    fixSvelteAssetPath( `${ paths }/src/App.svelte`, [
        {
            from: './assets/svelte.svg',
            to: '../assets/svelte.svg'
        },
        {
            from: './lib/Counter.svelte',
            to: '../lib/Counter.svelte'
        }
    ], `${ paths }/src/pages/Home.svelte` );
    writeFileSync( `${ paths }/src/App.svelte`, `<script${ PROJECT_LANG === 'ts' ? ' lang="ts"' : '' }>\n\timport { RouterProvider, createBrowserRouter } from 'vite-svelte-navigator';\n\t// Import your components (Home, About, UserProfile, etc.)\n\timport Home from './pages/Home.svelte';\n\tconst router = createBrowserRouter([\n\t\t{ path: '/', element: Home }\n\t]);\n</script>\n<RouterProvider {router} />`);
    promise_crt.stop('Project files created');
} catch( err ) {
    promise_crt.stop('Failed to create project');
    throw err;
}

// Install
const promise_ins = spinner();
promise_ins.start('Installing package...');
try {
    const cd = PROJECT_NAME === '.' ? '' : `cd ${ PROJECT_NAME } && `;;
    const command = `${cd}${ PROJECT_MANAGER } install && ${ PROJECT_MANAGER } ${ PROJECT_MANAGER === 'npm' ? 'install' : 'add' } vite-svelte-navigator@latest`;
    await execAsync( command );
    promise_ins.stop('All packages installed');
} catch( err ) {
    promise_ins.stop('Failed to install package');
    throw err;
}

outro('Have fun coding!');

if ( PROJECT_NAME !== '.' ) {
    console.log(`  cd ./${ PROJECT_NAME }`);
}
console.log(`  ${ PROJECT_MANAGER } run dev\n`);
