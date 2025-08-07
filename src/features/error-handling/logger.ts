/**
 * アプリケーション全体で使用する統一されたログ機能
 */

export type LogLevel = "error" | "warn" | "info" | "debug";

export interface LogContext {
	component?: string;
	operation?: string;
	data?: unknown;
}

/**
 * 統一されたログ出力
 */
export const logger = {
	error: (message: string, context?: LogContext, error?: unknown) => {
		const prefix = context?.component
			? `[${context.component}${context.operation ? `::${context.operation}` : ""}]`
			: "[Error]";

		const logData: Record<string, unknown> = {};
		if (context?.data) {
			logData.data = context.data;
		}
		if (error) {
			logData.error = error;
		}

		console.error(`${prefix} ${message}`, logData);
	},

	warn: (message: string, context?: LogContext) => {
		const prefix = context?.component
			? `[${context.component}${context.operation ? `::${context.operation}` : ""}]`
			: "[Warn]";

		console.warn(`${prefix} ${message}`, context?.data);
	},

	info: (message: string, context?: LogContext) => {
		const prefix = context?.component
			? `[${context.component}${context.operation ? `::${context.operation}` : ""}]`
			: "[Info]";

		console.info(`${prefix} ${message}`, context?.data);
	},

	debug: (message: string, context?: LogContext) => {
		if (import.meta.env.DEV) {
			const prefix = context?.component
				? `[${context.component}${context.operation ? `::${context.operation}` : ""}]`
				: "[Debug]";

			console.debug(`${prefix} ${message}`, context?.data);
		}
	},
};
