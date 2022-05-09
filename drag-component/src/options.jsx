import React from 'react'
import BgColor from './test-components/BgColor'
import OptionsColor from './test-components/BgColor/editor'
import Pagination from './test-components/Pagination'
import GridTable from './test-components/GridTable'
import Tab from './test-components/Tab'
import _Form from './test-components/Form'
import Title from './test-components/Title'
import OptionsText from './test-components/Title/editor'

export const menuList = [
  {
    id: '1001',
    title: '基本组件',
    list: [
      {
        id: '1001-1',
        name: '分页',
        icon: 'more',
        component: Pagination
      },
      {
        id: '1001-2',
        name: 'Grid表格',
        icon: 'table-compact',
        component: GridTable
      },
      {
        id: '1001-3',
        name: 'Tab栏',
        icon: 'nav-grid',
        component: Tab
      },
      {
        id: '1001-4',
        name: '背景',
        icon: 'brush',
        component: BgColor,
        editor: OptionsColor,
        editState: OptionsColor.editState
      },
      {
        id: '1001-5',
        name: '表单',
        icon: 'order',
        component: _Form
      },
      {
        id: '1001-6',
        name: '标题',
        icon: 'text-guide-o',
        component: Title,
        editor: OptionsText,
        editState: OptionsText.editState
      }
    ]
  }
]

export const phoneList = [
]