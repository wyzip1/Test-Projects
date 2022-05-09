import React, { Component } from 'react'
import styles from './styles.module.css'
import './index.css'
import MenuList from '../components/menu-list'
import sub from '../Subscribe'
import DragContainer from '../components/drag-container'

export default class index extends Component {
  state = {
    menuActiveKey: '1001',
    zhanweiIndex: 0,
    phoneComponentList: [],
    activeEditor: undefined
  }

  targetIndex = 0;

  constructor(props) {
    super(props);
    this.props.phoneList.map(com => {
      this.state.phoneComponentList.push(
        <DragContainer key={id}>
          {com.component}
        </DragContainer>
      )
    })
  }

  zhanwei = { type: 'zhanwei' }

  componentDidMount() {
    sub.on('changeDragState', dragStart => {
      const { phoneComponentList } = this.state;
      sub.set('dragStart', dragStart);
      if (dragStart) {
        phoneComponentList.unshift(this.zhanwei);
        this.setState({ phoneComponentList });
      } else {
        phoneComponentList.splice(phoneComponentList.indexOf(this.zhanwei), 1);
        this.setState({ phoneComponentList });
      }
    });

    sub.on('insert', direction => {

      const com = sub.get('dragComponent');
      const { phoneComponentList } = this.state;
      if (com) {
        const target = sub.get('dragComponent-insert');
        if (target === com) return;
        const index = phoneComponentList.indexOf(com);
        phoneComponentList.splice(index, 1);
        let targetIndex = phoneComponentList.indexOf(target);
        targetIndex = direction === 'up' ? targetIndex : targetIndex + 1;
        phoneComponentList.splice(targetIndex, 0, com);
        this.setState({ phoneComponentList });
      } else {
        const index = phoneComponentList.indexOf(this.zhanwei);
        phoneComponentList.splice(index, 1);
        let targetIndex = phoneComponentList.indexOf(sub.get('dragComponent-insert'));
        targetIndex = direction === 'up' ? targetIndex : targetIndex + 1;
        phoneComponentList.splice(targetIndex, 0, this.zhanwei);
        this.targetIndex = targetIndex;
        this.setState({ phoneComponentList });
      }
    });

    sub.on('content_click', ({ editor, editState, editor_props }) => {
      let activeEditor = { Editor: editor, props: { ...editor_props, editState } };
      if (!activeEditor.Editor) activeEditor = undefined;
      this.setState({ activeEditor });
    })
  }

  onDragOver = (ev) => {
    ev.preventDefault();
  }

  onDrop = (ev) => {
    if (sub.get('isNoDrop')) return;
    const { phoneComponentList } = this.state;
    const { Component, key, Editor, editState } = sub.get('component');
    const targetIndex = this.targetIndex;
    const item = { type: 'children', Component, editState, key, editor: Editor, editor_props: { sub_id: key, key } };
    phoneComponentList.splice(targetIndex, 0, item)
    const listItem = { phoneComponentList, activeEditor: { Editor, props: { sub_id: key, key } } };
    !Editor && (listItem.activeEditor = undefined);
    this.setState(listItem);
    sub.on(key, state => {
      const _index = this.state.phoneComponentList.indexOf(item);
      this.state.phoneComponentList[_index].editState = state;
      this.setState({ phoneComponentList })
    });
  }

  render() {
    const { menuList } = this.props;
    const { menuActiveKey, phoneComponentList, activeEditor } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.menuList}>
          <MenuList list={menuList} activeKey={menuActiveKey} />
        </div>
        <div className={styles['content_phone']}>
          <div
            className={styles.phone}
            onDrop={this.onDrop}
            onDragOver={this.onDragOver}
          >
            <div className={styles.header}>
              <img src="https://img01.yzcdn.cn/public_files/2019/02/11/14417a76b49dac2851efaf744f87cdb4.png" />
            </div>
            {phoneComponentList.map((item) => {
              const { type, Component, editState, key } = item;
              return type === 'children' ?
                <DragContainer key={key} item={item}>
                  <Component editState={editState} />
                </DragContainer> : <div className={styles.zhanwei} key="我是站位">
                  <span className={styles['zhanwei-txt']}>组件放置区域</span>
                </div>
            })}
          </div>
        </div>
        <div className={styles.editor}>
          {activeEditor && <activeEditor.Editor {...activeEditor.props} />}
        </div>
      </div>
    )
  }
}
