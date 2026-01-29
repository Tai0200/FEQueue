// components/Sidebar/Sidebar.tsx
import React, {useState, useContext, useEffect} from "react";
import { Menu } from "antd";
import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import {
  DashboardOutlined,
  DesktopOutlined,
  FileOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./Sidebar.css";
import "./HoverMenu.css";
import { SignalRContext } from "../../helpers/SignalRProvider";
type SideBarProps = {
  sendSelectedIndex: (index:number) => void;
}
const Sidebar = (props:SideBarProps) => {
  const [isSubMenuVisible, setSubMenuVisible] = useState(false);
  const connection = useContext(SignalRContext);
  const [selectedKey, setSelectedKey] = useState('0');
  const handleMouseEnter = () => {
    setSubMenuVisible(true);
  };

  const handleMouseLeave = () => {
    setSubMenuVisible(false);
  };
  const handleMenuClick = (index:number)=>{
    props.sendSelectedIndex(index);
  }
  useEffect(()=>{
    const menuIndex = localStorage.getItem('menuIndex');
    setSelectedKey(menuIndex == null ? '0' : menuIndex);
  },[])
  const handleClick = (e:any) => {
    setSelectedKey(e.key);
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src="./images/Logo.png" alt="Logo" />
      </div>
      <Menu
        mode="vertical"
        theme="light"
        selectedKeys={[selectedKey]} onClick={handleClick}
        className="menu"
      >
        <Menu.Item key="0" icon={<DashboardOutlined />}
        onClick={()=>{
          localStorage.setItem('menuIndex', '0');
          setSelectedKey('0')
          handleMenuClick(0)}}
        >
          Dashboard
        </Menu.Item>
        {localStorage.getItem('userRole')!='Doctor'?<>
          <Menu.Item key="1" icon={<DesktopOutlined />}
         onClick={()=>{
          localStorage.setItem('menuIndex', '1');
          setSelectedKey('1')
          handleMenuClick(1)}}
        >
          Thiết bị
        </Menu.Item>
        <Menu.Item key="5" icon={<FileOutlined />}
         onClick={()=>{
          localStorage.setItem('menuIndex', '5');
          setSelectedKey('5')
          handleMenuClick(5)
        }}
        >
          Dịch vụ
        </Menu.Item>
        </>:null}
        <Menu.Item key="6" icon={<FileOutlined />}
        onClick={()=>{
          localStorage.setItem('menuIndex', '6');
          setSelectedKey('6')
          handleMenuClick(6)}}
        >
          Cấp số
        </Menu.Item>
        <div className="hover-container"
        onMouseOver={handleMouseEnter}
        >
          <Menu.Item key="7" icon={<SettingOutlined />} className="menu-item">
            Cài đặt hệ thống
          </Menu.Item>
          {isSubMenuVisible && (
            <div className="submenu"
            onMouseOut={handleMouseLeave}
            >
              <Menu mode="vertical" theme="light" className="submenu-content">
                <Menu.Item key="sub2"
                onClick={()=>{
                  localStorage.setItem('menuIndex', '7');
                  setSelectedKey('7');
                  handleMenuClick(7)}}
                >Quản lý tài khoản</Menu.Item>
                <Menu.Item key="sub3">Nhật ký người dùng</Menu.Item>
              </Menu>
            </div>
          )}
        </div>
        <Menu.Item key="8" icon={<LogoutOutlined />} 
        onClick={async()=>{
          /*if(connection)
            if(connection.state==HubConnectionState.Connected){
              connection.invoke("UserDisconnected", localStorage.getItem('userName'));
            }*/
        localStorage.clear();
        window.location.reload();         
        }}
        className="logout">
          Đăng xuất
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
