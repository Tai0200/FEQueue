import React from 'react';
import { Form, Input, Button, Row, Col, Select, Switch, message } from 'antd';
import { fetchWithTokenRetry } from '../../helpers/tokens';
import './DeviceForm.css';

const { Option } = Select;
type FormProps = {
  myForm: any,
  serviceOptions: any,
  handleSendStatus: (status: boolean) => void
}
const DeviceForm = (props: FormProps) => {
  const [form] = Form.useForm();
  const token = localStorage.getItem('token');
  const initialValues = Object.keys(props.myForm).length === 0 ?
    {
      deviceCode: '',
      deviceName: '',
      ipAddress: '',
      username: '',
      password: '',
      service: '',
      operationStatus: false,
      connected: false
    }
    : {
      deviceCode: props.myForm.deviceCode,
      deviceName: props.myForm.deviceName,
      ipAddress: props.myForm.ipAddress,
      username: props.myForm.username,
      password: props.myForm.password,
      service: props.myForm.services ? (typeof props.myForm.services === 'string' ? props.myForm.services.split(',').map((s: string) => s.trim()) : props.myForm.services) : [],
      operationStatus: props.myForm.operationStatus === "Active" || props.myForm.operationStatus === true,
      connected: props.myForm.connected === "Connected" || props.myForm.connected === true
    };

  const handleFinish = async (values: any) => {
    const isUpdate = props.myForm.deviceCode && props.myForm.deviceCode !== "";
    const payload = {
      DeviceCode: values.deviceCode,
      DeviceName: values.deviceName,
      IpAddress: values.ipAddress,
      DeviceType: "Kiosk",
      UserName: values.username,
      Password: values.password,
      Services: Array.isArray(values.service) ? values.service.join(', ') : values.service,
      OperationStatus: !!values.operationStatus,
      Connected: !!values.connected
    };

    try {
      const url = isUpdate
        ? `${process.env.REACT_APP_API_URL}api/Device/${props.myForm.deviceCode}`
        : `${process.env.REACT_APP_API_URL}api/Device/`;

      const response = await fetchWithTokenRetry(url, {
        method: isUpdate ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        message.success(isUpdate ? 'Cập nhật thiết bị thành công' : 'Thêm thiết bị thành công');
        props.handleSendStatus(false);
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Có lỗi xảy ra khi lưu thiết bị');
      }
    } catch (error) {
      console.error("Error saving device:", error);
      message.error('Không thể kết nối đến server');
    }
  };

  return (
    <div className="device-form-container">
      <h2 className="device-form-title">Quản lý thiết bị</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
        className="device-form"
      >
        <Row gutter={24}>
          {/* Cột 1 */}
          <Col xs={24} lg={12}>
            <Form.Item
              name="deviceCode"
              label="Mã thiết bị"
              rules={[{ required: true, message: 'Mã thiết bị là bắt buộc' }]}
            >
              <Input placeholder="Nhập mã thiết bị" />
            </Form.Item>
            <Form.Item
              name="deviceName"
              label="Tên thiết bị"
              rules={[{ required: true, message: 'Tên thiết bị là bắt buộc' }]}
            >
              <Input placeholder="Nhập tên thiết bị" />
            </Form.Item>
            <Form.Item
              name="ipAddress"
              label="Địa chỉ IP"
              rules={[
                { required: true, message: 'Địa chỉ IP là bắt buộc' },
                { pattern: /^\d{1,3}(\.\d{1,3}){3}$/, message: 'Địa chỉ IP không hợp lệ' },
              ]}
            >
              <Input placeholder="Nhập địa chỉ IP" />
            </Form.Item>
            <Form.Item
              name="service"
              label="Dịch vụ sử dụng"
              rules={[{ required: true, message: 'Dịch vụ sử dụng là bắt buộc' }]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn dịch vụ"
                style={{ width: '100%' }}
              >
                {props.serviceOptions.map((opt: any) => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {/* Cột 2 */}
          <Col xs={24} lg={12}>
            <Form.Item label="Đang hoạt động" name="operationStatus" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="Đang kết nối" name="connected" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[{ required: true, message: 'Tên đăng nhập là bắt buộc' }]}
            >
              <Input placeholder="Nhập tài khoản" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Mật khẩu là bắt buộc' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>
        </Row>
        {/* Nút hành động */}
        <Form.Item>
          <div className="form-actions">
            <Button htmlType="button" onClick={() => props.handleSendStatus(false)}>Hủy bỏ</Button>
            <Button type="primary" htmlType="submit">
              Lưu thông tin
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DeviceForm;
