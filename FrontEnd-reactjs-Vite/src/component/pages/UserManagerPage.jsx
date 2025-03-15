import React, { useEffect, useState } from 'react';
import { message, notification, Table } from 'antd';
import { GetListUser } from '../../ultill/api';

const columns = [
    {
        title: 'Id',
        dataIndex: '_id',
    },
    {
        title: 'Họ tên',
        dataIndex: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Role',
        dataIndex: 'role',
    },
    {
        title: 'Ngày đăng ký',
        dataIndex: 'createdAt',
    },
];

const UserManagerPage = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getListUser = async () => {
            try {
                const res = await GetListUser();
                if (res && Array.isArray(res)) {
                    setData(res);
                } else {
                }
            } catch (error) {
            }
        }
        getListUser();
    }, [])

    return <Table style={{ padding: 32 }} bordered columns={columns} dataSource={data}
        rowKey={"_id"}
    />;
}
export default UserManagerPage;