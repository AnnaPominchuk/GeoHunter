import { Locale } from '@/config/i18n.config'

export interface Props {
    params: {
      lang: Locale, 
      shopId?: string
    }
  }