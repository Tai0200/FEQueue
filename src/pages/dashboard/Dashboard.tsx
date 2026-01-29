import React, { useState, useEffect, useContext } from "react";
import { Tag } from "antd";
import './styles.css'
import Device from "../../components/device";
import Sidebar from "../../components/sidebar";
import MainContent from "../../components/mainContent";
import RightSidebar from "../../components/rightSidebar";
import { getServiceData, getDeviceData, getUserData, getProvidedNumber, getTotalNumber } from "./Dashboard.logic";
import AccountForm from "../../components/AccountForm";
import { SignalRContext } from "../../helpers/SignalRProvider";
const Dashboard = () => {
  const [dataUserEdit, setDataUserEdit] = useState<any>({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [countItem, setCountItem] = useState(1);
  const [serviceOptions, setServiceOptions] = useState<{ value: string, label: string }[]>([])
  const handleReceiveSelectedIndex = async (index: number) => {
    if (index == 1) {
      let temp = await getDeviceData();
      setData(temp);
    }
    else if (index == 5) {
      let temp = await getServiceData();
      setData(temp);
    }
    else if (index == 7) {
      let temp = await getUserData();
      setData(localStorage.getItem('userRole') != 'Doctor' ? temp : temp.filter((x: any) => x.email == localStorage.getItem('userName')));
    }
    else if (index == 6) {
      let temp = await getProvidedNumber("All", "2000-01-01", "2050-12-12", "All", "___", 1, 5, "-1");
      let count = await getTotalNumber('All', '2000-01-01', '2050-12-31', 'All', '___', 'All')
      setCountItem(count);
      setData(temp);
    }
    else {
      setData([]);
    }
    setSelectedIndex(index);
  }
  const handleReceiveIndexFromDevice = (index: number, data: any) => {
    setDataUserEdit(data);
    setSelectedIndex(index);
  }
  const handleReceiveState = (status: boolean) => {
    if (!status) {
      setSelectedIndex(7);
    }
  }
  const handleUpdate = (updatedData: any) => {
    console.log('Cập nhật dữ liệu:', updatedData);
  };
  const handleCancel = () => {
    console.log('Hủy cập nhật');
  };
  useEffect(() => {
    setSelectedIndex(localStorage.getItem('menuIndex') != null ? Number(localStorage.getItem('menuIndex')) : 0);
    async function getDataSvc() {
      let srvData = await getServiceData();
      setServiceOptions(srvData);
    }
    getDataSvc();
  }, [])
  return (
    <div className="container">
      <Sidebar sendSelectedIndex={handleReceiveSelectedIndex} />
      {selectedIndex == 0 ?
        <div className="rightContainer">
          <MainContent />
          <RightSidebar />
        </div>
        : selectedIndex == 1 ?
          <Device key={`device-index-1`}
            buttonText="Thêm thiết bị"
            headerText="Thiến bị > Danh sách thiết bị"
            data={data}
            sendSelectedIndex={handleReceiveIndexFromDevice}
            columns={1} filter1="Trạng thái hoạt động" filter2="Trạng thái kết nối"
          />
          : selectedIndex == 2 ?
            null
            : selectedIndex == 3 ?
              null
              : selectedIndex == 4 ?
                null
                : selectedIndex == 5 ?
                  <Device headerText="Dịch vụ > Danh sách dịch vụ" buttonText="Thêm dịch vụ"
                    key={`device-index-5`}
                    sendSelectedIndex={handleReceiveIndexFromDevice}
                    data={data}
                    columns={2} filter1="Trạng thái hoạt động" filter2="Chọn thời gian"
                  />
                  : selectedIndex == 6 ? <Device headerText="Cấp số > Danh sách các số đã cấp"
                    buttonText="Cấp số mới"
                    key={`device-index-6`}
                    rowCount={countItem}
                    data={data}
                    sendSelectedIndex={handleReceiveIndexFromDevice}
                    columns={3} filter1="Tên dịch vụ" filter2="Tình trạng"
                  />
                    : selectedIndex == 7 ?
                      <Device headerText="Tài khoản người dùng > Danh sách tài khoản"
                        buttonText="Thêm người dùng"
                        key={`device-index-7`}
                        data={data}
                        sendSelectedIndex={handleReceiveIndexFromDevice}
                        columns={4} filter1="Tên vai trò" filter2="Trạng thái"
                      />
                      : <AccountForm myForm={dataUserEdit} serviceOptions={serviceOptions}
                        handleSendStatus={handleReceiveState}
                      />
      }
    </div>
  )
}
export default Dashboard;