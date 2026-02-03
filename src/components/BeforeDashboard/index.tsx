import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Pingu Blog Dashboard</h4>
      </Banner>
      <ul className={`${baseClass}__instructions`}>
        <li>
          <SeedButton />
          {' with sample content to get started, then '}
          <a href="/" target="_blank">
            visit your blog
          </a>
          {' to see the results.'}
        </li>
        <li>
          Create articles in the <strong>Posts</strong> collection, organize them with{' '}
          <strong>Categories</strong>, and manage <strong>Authors</strong>.
        </li>
        <li>
          Monitor <strong>Subscribers</strong> for newsletter signups.
        </li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
