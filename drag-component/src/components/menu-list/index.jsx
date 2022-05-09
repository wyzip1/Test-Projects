import React, { useState } from 'react'
import UseComponent from '../use-component'
import { Collapse } from 'zent'
import styles from './styles.module.css'

export default function MenuList({ list, activeKey: _activeKey }) {
  const [activeKey, setActiveKey] = useState(_activeKey);

  return (
    <Collapse
      activeKey={activeKey}
      panelTitleBackground="none"
      className={styles['select-collapse']}
      onChange={__activeKey => setActiveKey(__activeKey)}
      bordered={false}
    >
      {
        list.map(menu =>
          <Collapse.Panel title={menu.title} key={menu.id}>
            <div className={styles['grid-template']}>
              {
                menu.list.map(item =>
                  <UseComponent name={item.name} type={item.icon} key={item.id} component={item.component} editor={item.editor} editState={item.editState} />
                )
              }
            </div>
          </Collapse.Panel>
        )
      }
    </Collapse>
  )
}