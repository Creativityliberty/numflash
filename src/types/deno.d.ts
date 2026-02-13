
declare module 'npm:@insforge/sdk' {
    export * from '@insforge/sdk';
}

declare module 'npm:jszip' {
    const JSZip: any;
    export default JSZip;
}

declare module 'npm:@octokit/rest' {
    export class Octokit {
        constructor(options: any);
        git: any;
    }
}

// Add Deno global type
declare global {
    const Deno: {
        env: {
            get(key: string): string | undefined;
            toObject(): Record<string, string>;
        };
    };

    // Allow Blob/File in Deno env if needed (polyfilled by runtime)
}

export {};
