import React from 'react';
import {
    Button, Space,
    Popconfirm
} from 'antd';
const ActionButtonRender = (params) => {
    return (
        <Space>
            <Button type="primary" onClick={() => { params.handleEdit(params.params.node.data) }}>
                Edit
            </Button>
            <Popconfirm
                title="Delete the record"
                description="Are you sure to delete this record?"
                onConfirm={() => params.handleDelete(params.params.node.data.id)}
                okText="Yes"
                cancelText="No"
            >
                <Button type="danger">
                    Delete
                </Button>
            </Popconfirm>

        </Space>
    );
};
export default ActionButtonRender;  