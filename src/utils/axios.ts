import axios from "axios";
import { getAllSettings } from "../webviews/utils/workspace";
import { ExtensionContext } from "vscode";

interface ProxyConfigSettings {
	enabled: boolean;
	hostname: string;
	port: number;
	protocol: "HTTP" | "HTTPS";
	auth: boolean;
	username: string;
}

async function getProxySettings(proxySettings: ProxyConfigSettings, context: ExtensionContext) {
	const final = {} as axios.AxiosProxyConfig;
	if (proxySettings.enabled !== true) return;

	final.protocol = proxySettings.protocol.toLowerCase();
	final.host = proxySettings.hostname;
	final.port = proxySettings.port;
	if (proxySettings.auth === true) {
		const proxyPassword = await context.secrets.get("curling.proxy.password");
		final.auth = {
			username: proxySettings.username,
			password: proxyPassword,
		};
	}

	return final;
}

function getRequestDefaults(settings: Partial<axios.AxiosRequestConfig>) {
	return {
		timeout: settings.timeout,
		maxContentLength: settings.maxContentLength,
		maxBodyLength: settings.maxBodyLength,
		maxRedirects: settings.maxRedirects,
		socketPath: settings.socketPath,
	};
}

export async function getAxiosInstance(context: ExtensionContext): Promise<axios.AxiosInstance> {
	const settings = getAllSettings();
	const proxy = await getProxySettings(settings.proxy, context);

	const axiosConfig = {
		proxy,
		...getRequestDefaults(settings.requestDefaults),
	};
	return axios.create(axiosConfig);
}
