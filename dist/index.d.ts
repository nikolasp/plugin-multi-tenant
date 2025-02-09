import type { Config } from 'payload';
import type { MultiTenantPluginConfig } from './types';
export declare const multiTenantPlugin: <ConfigType>(pluginConfig: MultiTenantPluginConfig<ConfigType>) => (incomingConfig: Config) => Config;
