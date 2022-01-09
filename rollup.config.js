import css from 'rollup-plugin-css-only';
import svelte from 'rollup-plugin-svelte';
import esbuild from 'rollup-plugin-esbuild';
import commonjs from '@rollup/plugin-commonjs';
import sveltePreprocess from 'svelte-preprocess';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const production = (process.env.NODE_ENV === 'production' ? true : false);

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'preview'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default [
    {
        input: 'src/main-process/main.ts',
        output: [
            {
                format: 'cjs',
                sourcemap: !production,
                file: 'public/main.cjs',
            }
        ],
        plugins: [
            nodeResolve(),
            commonjs(),
            esbuild({
                target: 'esnext',
                minify: production,
                sourceMap: !production,
                include: 'src/main-process/**/*',
            })
        ],
        external: ['electron', 'electron-store']
    },
    {
        input: 'src/context-bridge/main.ts',
        output: [
            {
                format: 'cjs',
                sourcemap: !production,
                file: 'public/preload.cjs',
            }
        ],
        plugins: [
            nodeResolve(),
            commonjs(),
            esbuild({
                target: 'esnext',
                minify: production,
                sourceMap: !production,
                include: 'src/context-bridge/**/*',
            })
        ],
        external: ['electron']
    },
    {
        input: 'src/main-window/main.ts',
        output: [
            {
                format: 'esm',
                sourcemap: !production,
                file: 'public/build/bundle.mjs',
            }
        ],
        plugins: [
            svelte({
                preprocess: sveltePreprocess({ sourceMap: !production }),
                compilerOptions: { dev: !production }
            }),
            nodeResolve({
                browser: true,
                dedupe: ['svelte']
            }),
            esbuild({
                target: 'esnext',
                minify: production,
                sourceMap: !production,
                include: 'src/main-window/**/*',
            }),
            css({
                output: 'bundle.css'
            }),
            !production && serve()
        ]
    }
]