export type Sport = 'Volleyball' | 'Football'
export type Category = 'Male' | 'Female'

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

export type FilterOption = 'All' | 'Volleyball Male' | 'Volleyball Female' | 'Football Male' | 'Football Female'
