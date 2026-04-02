import { NextRequest, NextResponse } from 'next/server'
const QUOTES = [{quote:"시장이 패닉에 빠질 때 탐욕스러워라.",author:"워렌 버핏"},{quote:"단기적으로 시장은 인기투표 기계다.",author:"벤저민 그레이엄"},{quote:"참을성은 투자자의 가장 큰 미덕이다.",author:"찰리 멍거"}]
export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { stock, change, buyReason } = await req.json()
    const q = QUOTES[Math.floor(Math.random()*QUOTES.length)]
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ quote: q.quote, author: q.author, message: stock + ' 매도 전 잠깐. 지금 이 판단이 감정인지 확인해봐.' })
    }
    const Anthropic = require('@anthropic-ai/sdk')
    const client = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY })
    const res = await client.messages.create({ model:'claude-sonnet-4-20250514', max_tokens:300, messages:[{role:'user',content:'투자자가 ' + stock + '(' + change + ') 매도하려함. 매수이유:' + buyReason + '. 감정vs판단 확인 2문장. JSON: {quote,author,message}'}] })
    const text = res.content[0].type==='text'?res.content[0].text:''
    return NextResponse.json(JSON.parse(text))
  } catch (e:any) {
    return NextResponse.json({ quote: QUOTES[0].quote, author: QUOTES[0].author, message: '지금 이 판단이 감정인지 확인해봐.' })
  }
}
