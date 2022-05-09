import React, { Component } from 'react';
import { Grid } from 'zent';

const columns = [
  {
    title: '商品名',
    name: 'name',
    className: 'name'
  }, {
    title: '访问量',
    name: 'uv'
  }, {
    title: '库存',
    name: 'stock',
    defaultText: 0
  }
];

const datasets = [];

for (let i = 0; i < 3; i++) {
  datasets.push({
    id: `id-${i}`,
    name: `商品 ${i}`,
    uv: 20,
    stock: i > 1 ? 5 : null
  })
}

export default class GridTable extends Component {
  render() {
    return (
      <Grid
        columns={columns}
        datasets={datasets}
        rowClassName={(data, index) => `${data.id}-${index}`}
        onRowClick={(data, index, event) => { console.log(data, index, event.target, 'simple onRowClick') }}
      />
    )
  }
}