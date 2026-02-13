
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

declare const Deno: {
    env: {
        get(key: string): string | undefined;
    }
};
