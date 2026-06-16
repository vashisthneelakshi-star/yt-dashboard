const BASE = 'https://www.googleapis.com/youtube/v3'
export function extractVideoId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}
export async function fetchVideoData(videoId: string, apiKey: string) {
  try {
    const res = await fetch(`${BASE}/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`)
    const data = await res.json()
    if (data.error || !data.items?.length) return null
    const item = data.items[0]
    return {
      id: videoId, title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails?.medium?.url ?? '',
      publishedAt: item.snippet.publishedAt,
      duration: item.contentDetails.duration,
      views: parseInt(item.statistics.viewCount ?? '0'),
      likes: parseInt(item.statistics.likeCount ?? '0'),
      comments: parseInt(item.statistics.commentCount ?? '0'),
    }
  } catch { return null }
}
export async function fetchBatchAnalytics(videoIds: string[], apiKey: string) {
  const result: Record<string, { views: number; likes: number; comments: number }> = {}
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50).join(',')
    try {
      const res = await fetch(`${BASE}/videos?part=statistics&id=${batch}&key=${apiKey}`)
      const data = await res.json()
      data.items?.forEach((item: any) => {
        result[item.id] = { views: parseInt(item.statistics.viewCount??'0'), likes: parseInt(item.statistics.likeCount??'0'), comments: parseInt(item.statistics.commentCount??'0') }
      })
    } catch {}
  }
  return result
}
