// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	interface Window {
		ethereum?: import('ethers').Eip1193Provider & {
			on?: (eventName: string, listener: (...args: any[]) => void) => void;
			removeListener?: (eventName: string, listener: (...args: any[]) => void) => void;
			request: (request: { method: string; params?: Array<any> }) => Promise<any>;
		};
	}
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
