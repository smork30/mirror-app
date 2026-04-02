시장이패닉에빠질때탐욕스러워라워렌버핏단기적으로시장은인기투표기계다벤저민그레이엄참을성은투자자의가장큰미덕이다찰리멍거매도전잠깐지금이판단이감정인지근거있는판단인지확인해봐투자자가매도하려함매수이유차분하게감정판단확인해주는문장만명언이름메시지지금이판단이감정인지확인해봐매수이유가바뀌었어import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateAlert } from '@/lib/claude'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { stock, change, buyReason } = await req.json()

  // 과거 일기 가져오기
  const { data: pastDiaries } = await supabase
    .from('diaries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  // Claude API로 맞춤 알림 생성
  const alert = await generateAlert({
    stock, change, buyReason,
    pastDiaries: pastDiaries || []
  })

  return NextResponse.json(alert)
}
