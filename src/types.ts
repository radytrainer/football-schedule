export type Sport = 'Volleyball' | 'Football'
export type Category = 'Boys' | 'Girls'

export interface Match {
  id: number
  sport: Sport
  category: Category
  date: string
  time: string
  teamA: string
  teamB: string
  place: string
  notes: string
}

export type FilterOption = 'All' | 'Volleyball Boys' | 'Volleyball Girls' | 'Football Boys' | 'Football Girls'
