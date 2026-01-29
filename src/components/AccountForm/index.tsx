import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Select, Upload, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import type { UploadFile } from "antd/es/upload/interface";
import { getServiceData } from '../../pages/dashboard/Dashboard.logic';
import './AccountForm.css';

const { Option } = Select;
type AccountFormProps = {
  myForm: any,
  serviceOptions: any,
  handleSendStatus: (status:boolean)=>void
}
const AccountForm = (props:AccountFormProps) => {
  const email = Object.keys(props.myForm).length === 0 ? '' : props.myForm.email;
  const token = localStorage.getItem('token');
  const [isNoteDisable, setIsNotDisable] = useState(true);
  const [serviceOptions, setServiceOptions] = useState<{value:string, label: string}[]>([])
  const [form] = Form.useForm();
  const initialValues = Object.keys(props.myForm).length === 0 ?
  {
    fullName: '', // Pre-fill the username field
    email: '', // Pre-fill the email field
    phoneNumber: ''
  }
  : {
    fullName: props.myForm.fullName, // Pre-fill the username field
    email: props.myForm.email, // Pre-fill the email field
    phoneNumber: props.myForm.phoneNumber
  }
  useEffect(()=>{
    console.log(props.myForm);
    form.setFieldsValue(Object.keys(props.myForm).length === 0?
    {
      fullName: '', // Pre-fill the username field
      email: '', // Pre-fill the email field
      phoneNumber: ''
    }
    :{
      fullName: props.myForm.fullName,
      email: props.myForm.email,
      phoneNumber: props.myForm.phoneNumber,
    });
    async function getDataSvc(){
      let srvData = await getServiceData();
      setServiceOptions(srvData.map((item:any)=>{
          return {value:item.serviceCode, label:item.serviceName}
      }));
    }
    getDataSvc();
},[props.myForm, form])

function buildFormData(values: any) {
  const fd = new FormData();
  // Text fields
  fd.append("email", values.email ?? "");
  fd.append("fullName", values.fullName ?? "");
  fd.append("phoneNumber", values.phoneNumber ?? "");
  fd.append("userRole", values.userRole ?? "");
  fd.append("password", values.password ?? "");
  fd.append("note", values.note ?? "");
  fd.append("taxCode", "volodia1917@gmail.com");
  const fileList: UploadFile[] = values.imageData ?? [];
  if (fileList.length > 0) {
    const fileObj = fileList[0]?.originFileObj as File | undefined;
    if (fileObj) {
      fd.append("avatar", fileObj); // key phải đúng theo backend
    }
  }
  return fd;
}

  const handleFinish = async (values: any) => {
    console.log(values);
    if(props.myForm.email==null){
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+'api/Authenticate/user', {
          method: 'POST',
          headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            email: values.email,
  password: values.password,
  fullName: values.fullName,
  phoneNumber: values.phoneNumber,
  isActive: false,
  userRole: values.userRole,
  taxCode: 'volodia1917@gmail.com',
  note: values.note
          }),
        });
        if (response.ok) {
          const data = await response.json();
            message.success(data.message);
            console.log(data.message);
            props.handleSendStatus(false);
        } else {
          message.error('Bạn không được cập nhật thông tin người khác');
        }
      } catch (error) {
        message.error('An error occurred while submitting the form.');
      }
    }
    else{
        // Code update
        try {
    // bỏ confirmPassword trước khi gửi
    const { confirmPassword, ...payload } = values;
    const url = process.env.REACT_APP_API_URL+'api/Authenticate/' + props.myForm.email;

    const formData = buildFormData(payload);

    const token = localStorage.getItem("token"); // nếu có auth

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    // parse response an toàn
    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      throw new Error(
        (typeof data === "object" && data?.message) ? data.message : String(data)
      );
    }

    console.log("PUT success:", data);
    message.success("Lưu dữ liệu thành công");
  } catch (e: any) {
    console.error("PUT error:", e);
    message.error(e?.message ?? "Cập nhật thất bại");
  }
    }
  };
  return (
    <div className="account-form-container">
      <h2 className="account-form-title">Quản lý tài khoản</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
        className="account-form"
      >
      <Row>
        <Col xs={24}>
        {props.myForm.email==""?null:
        <Form.Item
        name="imageData"
        label="Ảnh đại diện"
        valuePropName="fileList"
        getValueFromEvent={(e) => {
          // Ensure file list is extracted properly
          if (Array.isArray(e)) {
            return e;
          }
          return e?.fileList;
        }}
        rules={[
          {
            required: false,
            message: 'Vui lòng tải lên ảnh đại diện',
          },
        ]}
      >
        <Upload
          name="imageData"
          listType="picture-card"
          accept="image/*"
          maxCount={1}
          beforeUpload={() => false} // Prevent upload to server for now
        >
          <div>
            <div style={{ marginTop: 8 }}>Tải lên</div>
          </div>
        </Upload>
      </Form.Item>}
        </Col>
      </Row>
        <Row gutter={24}>
          {/* Cột 1 */}
          <Col xs={24} lg={12}>
          <Form.Item
              name="email"
              label="Địa chỉ mail"
              rules={[{ required: true, message: 'Email là bắt buộc' }]}
            >
              <Input placeholder="Nhập email" disabled={props.myForm.email!=null?true:false} />
            </Form.Item>
            <Form.Item
              name="fullName"
              label="Họ tên"
              rules={[{ required: true, message: 'Họ tên là bắt buộc' }]}
            >
              <Input placeholder="Nhập họ tên" />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Số điện thoại là bắt buộc' }]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
            <Form.Item
              name="userRole"
              label="Vai trò"
              rules={[{ required: props.myForm.email==null ? true: false, message: 'Vai trò là bắt buộc' }]}
            >
              <Select placeholder="Chọn vai trò" onChange={(values:string)=>{
                  if(values=="Doctor"){
                      setIsNotDisable(false);        
                  }
                  else{
                    form.setFieldsValue({
                      note: null,  // Reset the specific field to an empty string
                    });
                    setIsNotDisable(true);
                  }
                }}>
                <Option value="Admin">Quản trị viên</Option>
                <Option value="Staff">Người dùng</Option>
                <Option value="Doctor">Bác sỹ</Option>
              </Select>
            </Form.Item>
          </Col>
          {/* Cột 2 */}
          <Col xs={24} lg={12}>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: props.myForm.email==null ? true: false, message: 'Mật khẩu là bắt buộc' }]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Nhập lại mật khẩu"
              rules={[
                { required: props.myForm.email==null ? true: false, message: 'Vui lòng nhập lại mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Mật khẩu không khớp')
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Nhập lại mật khẩu"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item
              name="note"
              label="Ghi chú (chọn lĩnh vực khám bệnh đối với bác sỹ)"
            >
              <Select placeholder="Chọn dịch vụ" disabled={isNoteDisable}>
                {serviceOptions.map((item:any)=>{
                  return(
                    <Option value={item.value}>{item.label}</Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {/* Nút hành động */}
        <Form.Item>
          <div className="form-actions">
            <Button htmlType="button">Hủy bỏ</Button>
            <Button type="primary" htmlType="submit">
              Lưu dữ liệu
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AccountForm;
