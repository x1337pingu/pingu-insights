import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border">
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-3">
            <Link className="flex items-center" href="/">
              <Logo />
            </Link>
            <p className="text-[#8D8DC0] text-sm max-w-xs">
              Market intelligence by Pingu. Decentralized perpetuals on Monad.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[#8D8DC0] text-xs font-semibold uppercase tracking-wider">
                Pingu
              </span>
              <a href="https://pingu.exchange/trade" target="_blank" rel="noopener noreferrer" className="text-[#D5D5DA] text-sm hover:text-white transition-colors">Trade</a>
              <a href="https://pingu.exchange/referral" target="_blank" rel="noopener noreferrer" className="text-[#D5D5DA] text-sm hover:text-white transition-colors">Referral</a>
              <a href="https://pingu.exchange/points" target="_blank" rel="noopener noreferrer" className="text-[#D5D5DA] text-sm hover:text-white transition-colors">Points</a>
              <a href="https://docs.pingu.exchange" target="_blank" rel="noopener noreferrer" className="text-[#D5D5DA] text-sm hover:text-white transition-colors">Docs</a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[#8D8DC0] text-xs font-semibold uppercase tracking-wider">
                Community
              </span>
              <a href="https://x.com/PinguExchange" target="_blank" rel="noopener noreferrer" className="text-[#D5D5DA] text-sm hover:text-white transition-colors">X / Twitter</a>
              <a href="https://discord.gg/pinguexchange" target="_blank" rel="noopener noreferrer" className="text-[#D5D5DA] text-sm hover:text-white transition-colors">Discord</a>
            </div>

{(() => {
              const filteredItems = navItems.filter(({ link }) => {
                const url = link?.url || ''
                const ref = link?.reference?.value
                const slug = typeof ref === 'object' && ref?.slug ? ref.slug : ''
                return !url.includes('admin') && !slug.includes('admin')
              })
              return filteredItems.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <span className="text-[#8D8DC0] text-xs font-semibold uppercase tracking-wider">
                    More
                  </span>
                  <nav className="flex flex-col gap-2">
                    {filteredItems.map(({ link }, i) => (
                      <CMSLink
                        className="text-[#D5D5DA] text-sm hover:text-white transition-colors"
                        key={i}
                        {...link}
                      />
                    ))}
                  </nav>
                </div>
              ) : null
            })()}
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-border">
          <p className="text-[#8D8DC0] text-xs text-center">
            This content is for informational purposes only. Not financial advice. Do your own research.
          </p>
        </div>
      </div>
    </footer>
  )
}
