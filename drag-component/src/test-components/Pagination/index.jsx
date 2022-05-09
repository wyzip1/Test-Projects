import React, { Component } from 'react';

import { Pagination as _Pagination } from 'zent';

const PAGE_SIZE_OPTIONS = [10, 20, 30];

export default class Pagination extends Component {
  state = {
    pageSize: 10,
    current: 2,
  };

  onChange = options => {
    this.setState(options);
  };

  render() {
    const { current, pageSize } = this.state;

    return (
      <div>
        <_Pagination
          current={current}
          pageSize={pageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          total={101}
          onChange={this.onChange}
        />
      </div>
    );
  }
}