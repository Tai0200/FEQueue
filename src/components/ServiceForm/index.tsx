import React from 'react';
import { Form, Input, Button, Row, Col, Checkbox, message } from 'antd';
import './ServiceForm.css';

import { fetchWithTokenRetry } from '../../helpers/tokens';

type ServiceFormProps = {
  myForm?: any,
  handleSendStatus?: (status: boolean) => void
}

const ServiceForm: React.FC<ServiceFormProps> = (props) => {
  const [form] = Form.useForm();

  const isUpdate = props.myForm && Object.keys(props.myForm).length > 0;

  const initialValues = !isUpdate ? {
    serviceCode: '',
    serviceName: '',
    description: '',
    autoIncrement: false,
    autoStart: '0001',
    autoEnd: '9999',
    prefix: false,
    prefixValue: '0001',
    surfix: false,
    surfixValue: '0001',
    resetDaily: false
  } : {
    serviceCode: props.myForm.serviceCode,
    serviceName: props.myForm.serviceName,
    description: props.myForm.description,
    autoIncrement: props.myForm.autoIncrement || false,
    autoStart: props.myForm.autoStart || '0001',
    autoEnd: props.myForm.autoEnd || '9999',
    prefix: props.myForm.prefix || false,
    prefixValue: props.myForm.prefixValue || '0001',
    surfix: props.myForm.surfix || false,
    surfixValue: props.myForm.surfixValue || '0001',
    resetDaily: props.myForm.resetDaily || false
  };

  const handleFinish = async (values: any) => {
    try {
      const payload = {
        ServiceCode: values.serviceCode,
        ServiceName: values.serviceName,
        Description: values.description,
        AutoIncrement: !!values.autoIncrement,
        AutoStart: values.autoStart,
        AutoEnd: values.autoEnd,
        Prefix: !!values.prefix,
        PrefixValue: values.prefixValue,
        Surfix: !!values.surfix,
        SurfixValue: values.surfixValue,
        ResetDaily: !!values.resetDaily
      };

      const url = isUpdate
        ? `${process.env.REACT_APP_API_URL}api/Service/${props.myForm.serviceCode}`
        : `${process.env.REACT_APP_API_URL}api/Service/`;

      const response = await fetchWithTokenRetry(url, {
        method: isUpdate ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        message.success(isUpdate ? 'Cập nhật dịch vụ thành công' : 'Thêm dịch vụ thành công');
        if (props.handleSendStatus) props.handleSendStatus(false);
      } else {
        const error = await response.json();
        message.error(error.message || 'Lỗi khi lưu dịch vụ');
      }
    } catch (error) {
      console.error("Error saving service:", error);
      message.error('Không thể kết nối đến server');
    }
  };

  return (
    <div className="service-form-container">
      <h2 className="service-form-title">Quản lý dịch vụ</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
        className="service-form"
      >
        <Row gutter={24}>
          {/* Thông tin dịch vụ */}
          <Col xs={24} lg={12}>
            <Form.Item
              name="serviceCode"
              label="Mã dịch vụ"
              rules={[{ required: true, message: 'Mã dịch vụ là bắt buộc' }]}
            >
              <Input placeholder="Nhập mã dịch vụ" />
            </Form.Item>
            <Form.Item
              name="serviceName"
              label="Tên dịch vụ"
              rules={[{ required: true, message: 'Tên dịch vụ là bắt buộc' }]}
            >
              <Input placeholder="Nhập tên dịch vụ" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea placeholder="Mô tả dịch vụ" rows={4} />
            </Form.Item>
          </Col>
        </Row>
        {/* Quy tắc cấp số */}
        <div className="rules-section">
          <h3>Quy tắc cấp số</h3>
          <Row gutter={24}>
            <Col xs={24} lg={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Form.Item name="autoIncrement" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <Checkbox>Tăng tự động từ</Checkbox>
                </Form.Item>
                <Form.Item name="autoStart" style={{ marginBottom: 0, width: '70px' }}>
                  <Input placeholder="0001" />
                </Form.Item>
                <span className="to-text">đến</span>
                <Form.Item name="autoEnd" style={{ marginBottom: 0, width: '70px' }}>
                  <Input placeholder="9999" />
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Form.Item name="prefix" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <Checkbox>Prefix</Checkbox>
                </Form.Item>
                <Form.Item name="prefixValue" style={{ marginBottom: 0, flex: 1 }}>
                  <Input placeholder="0001" />
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Form.Item name="surfix" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <Checkbox>Surfix</Checkbox>
                </Form.Item>
                <Form.Item name="surfixValue" style={{ marginBottom: 0, flex: 1 }}>
                  <Input placeholder="0001" />
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item name="resetDaily">
                <Checkbox>Reset mỗi ngày</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </div>
        {/* Nút hành động */}
        <Form.Item>
          <div className="form-actions">
            <Button htmlType="button" onClick={() => props.handleSendStatus && props.handleSendStatus(false)}>
              Hủy bỏ
            </Button>
            <Button type="primary" htmlType="submit">
              {isUpdate ? 'Cập nhật' : 'Thêm dịch vụ'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ServiceForm;
