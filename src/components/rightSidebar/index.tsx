// components/RightSidebar/RightSidebar.tsx
import React, { useEffect, useState } from "react";
import { Calendar } from "antd";
import SummaryItem from "../summaryItem";
import { LaptopOutlined, SettingOutlined, FileTextOutlined, BellOutlined } from "@ant-design/icons";
import "./RightSidebar.css";
import { getSummaryData } from "./RightSidebar.logic";
const RightSidebar: React.FC = () => {
  const [summaryData, setSummaryData] = useState<any>([]);
  useEffect(()=>{
    async function getData(){
      let summaryTemp = await getSummaryData();
      console.log(summaryTemp);
      if(summaryTemp.length==3){
      setSummaryData([{key:1, title: "Thiết bị", percentage:Math.ceil(summaryTemp[0].active*100/summaryTemp[0].total),
        value: summaryTemp[0].total, icon: <SettingOutlined />, color: "#52C41A",
        active: summaryTemp[0].active, inactive: summaryTemp[0].total-summaryTemp[0].active
       }, {key: 2, title: "Dịch vụ", percentage:  Math.ceil(summaryTemp[1].active*100/summaryTemp[1].total), value: summaryTemp[1].total,
        active: summaryTemp[1].active, inactive: summaryTemp[1].total-summaryTemp[1].active,
        icon: <SettingOutlined />,
      color: "#52C41A",
       }, {
        key:3,
        percentage: Math.ceil(summaryTemp[2].active*100/summaryTemp[2].total),
        title: "Cấp số",
        value: summaryTemp[2].total,
        active: summaryTemp[2].active,
        inactive: summaryTemp[2].total-summaryTemp[2].active,
        icon: <FileTextOutlined />,
        color: "#409EFF",
      },])
    }
    }
    getData();
  },[])
  return (
    <div className="right-sidebar">
      <div className="user-info">
        <BellOutlined className="notification-icon" />
        <div className="user">
          <p>Xin chào</p>
          <h3>{localStorage.getItem('userFullName')}</h3>
        </div>
      </div>
      <h2>Tổng quan</h2>
      <div className="summary">
        {summaryData.map((item:any) => (
          <SummaryItem
            key={item.key}
            percentage={item.percentage}
            title={item.title}
            value={item.value}
            active={item.active}
            inactive={item.inactive}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </div>
      <div className="summary">
        <Calendar fullscreen={false} />
      </div>
    </div>
  );
};

export default RightSidebar;
