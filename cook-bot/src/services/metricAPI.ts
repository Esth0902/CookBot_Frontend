import type {Metric} from "@/services/aiAPI";
import {authFetch} from "@/services/authApi";

export async function getMetricByUserName(id:number): Promise<Metric[]> {
    const response = await authFetch('/api/v1/metric/' + id, {
        method: 'GET',
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Erreur lors de la récupération des métriques');
    }

    const json = await response.json() as {
        success: boolean;
        responseCode: number;
        responseMessage: string;
        data: Metric[];
    };

    return json.data;
}

function formatDateForBackend(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day}%20${hours}:${minutes}:${seconds}`;
}

export async function getMetricByRangeDate(dateStart:Date,dateEnd:Date): Promise<Metric[]> {
    const dateEndFormat = formatDateForBackend(dateEnd);
    const dateStartFormat = formatDateForBackend(dateStart);

    console.log(dateStartFormat,dateEndFormat)
    const response = await authFetch(`/api/v1/metric?dateStart=${dateStartFormat}&dateEnd=${dateEndFormat}`, {
        method: 'GET',
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Erreur lors de la récupération des métriques');
    }

    const json = await response.json() as {
        success: boolean;
        responseCode: number;
        responseMessage: string;
        data: Metric[];
    };

    return json.data;
}