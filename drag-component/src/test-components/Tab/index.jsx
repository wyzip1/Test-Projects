import React from 'react'

import { Tabs, Icon } from 'zent';
const TabPanel = Tabs.TabPanel;
let uniqId = 4;

export default class Tab extends React.Component {
  state = {
    activeId: '2',
    panels: [
      {
        tab: <span>选项1</span>,
        id: '1',
        disabled: true,
        content: '选项1的内容',
      },
      {
        tab: <span>选项2</span>,
        id: '2',
        content: <div>选项2的内容</div>,
      },
    ],
  };

  onTabAdd = () => {
    let { panels } = this.state;
    panels.push({
      tab: `选项${uniqId}`,
      id: `${uniqId++}`,
      content: Date.now(),
    });
    this.setState({
      panels,
    });
  };

  onTabDel = id => {
    const { panels } = this.state;
    this.setState({
      panels: panels.filter((p, i) => p.id !== id),
    });
  };

  onTabChange = id => {
    this.setState({
      activeId: id,
    });
  };

  renderPanels() {
    let { panels } = this.state;
    return panels.map(p => {
      return (
        <TabPanel {...p} key={p.id}>
          {p.content}
        </TabPanel>
      );
    });
  }

  render() {
    const panels = this.renderPanels();
    return (
      <div className="zent-tabs-demo">
        <Tabs
          candel
          stretch
          activeId={this.state.activeId}
          onChange={this.onTabChange}
          onDelete={this.onTabDel}
          navExtraContent={<Icon type="plus" className="zent-tabs-add-btn" onClick={this.onTabAdd} />}
        >
          {panels}
        </Tabs>
        <Tabs
          candel
          stretch
          type="card"
          activeId={this.state.activeId}
          onChange={this.onTabChange}
          onDelete={this.onTabDel}
          navExtraContent={<Icon type="plus" className="zent-tabs-add-btn" onClick={this.onTabAdd} />}
        >
          {panels}
        </Tabs>
        <Tabs
          stretch
          type="button"
          activeId={this.state.activeId}
          onChange={this.onTabChange}
          navExtraContent={<Icon type="plus" className="zent-tabs-add-btn" onClick={this.onTabAdd} />}
        >
          {panels}
        </Tabs>
      </div>
    );
  }
}