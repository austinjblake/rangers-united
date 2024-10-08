import { customType } from 'drizzle-orm/pg-core';

export const geography = customType<{
	data: string;
	notNull: boolean;
	default: boolean;
}>({
	dataType() {
		return 'geography';
	},
	toDriver(value: string): string {
		return value;
	},
	fromDriver(value: any): string {
		return value;
	},
});
