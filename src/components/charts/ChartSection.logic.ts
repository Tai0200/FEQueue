export const getChartData = async (optionSelected: string): Promise<{ name: string, value: number }[]> => {
    const token = localStorage.getItem('token');
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
        // 2. Sử dụng await trực tiếp với fetch (fetch trả về Promise nên không cần new Promise bên ngoài)
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        // 3. Kiểm tra HTTP Status (Cực kỳ quan trọng để bắt lỗi 4xx, 5xx)
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