import { fetchWithTokenRetry } from "../../helpers/tokens";

export const getChartData = async (optionSelected: string): Promise<{ name: string, value: number }[]> => {
    const currentMonth = new Date().getMonth() + 1;
    let endpoint = '';

    // 1. Xác định endpoint dựa trên lựa chọn (Clean code: tách biệt logic chọn đường dẫn)
    if (optionSelected === "0") {
        endpoint = `api/Assignment/statisticbymonth/${currentMonth}/`;
    } else if (optionSelected === "1") {
        endpoint = `api/Assignment/statisticbyweek/${currentMonth}/`;
    } else {
        endpoint = `api/Assignment/statisticbyyear/`;
    }

    const url = `${process.env.REACT_APP_API_URL}${endpoint}`;

    try {
        const response = await fetchWithTokenRetry(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Chart data fetched successfully:", data);
        return data;

    } catch (err) {
        // 4. Xử lý lỗi tập trung giúp code an toàn hơn
        console.error("Failed to fetch chart data:", err);
        return []; // Trả về mảng rỗng để đảm bảo UI không bị crash
    }
}