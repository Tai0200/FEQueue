import { fetchWithTokenRetry } from "../../helpers/tokens";

export const getSummaryData = async (): Promise<any> => {
    const url = `${process.env.REACT_APP_API_URL}api/Assignment/statistic`;

    try {
        const response = await fetchWithTokenRetry(url);

        // Kiểm tra HTTP Status
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse JSON an toàn
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching summary data:", error);
        throw error; // Ném lỗi ra ngoài để UI xử lý nếu cần
    }
}