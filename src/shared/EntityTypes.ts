export interface EventModel {
  id: string,
  description: string,
  final_date: string,
  federation_id: string,
  created: string,
  modified: string,
}

export interface EventDetailModel {
  data: {
    id: string,
    description: string,
    picture:string,
    website: string,
    scope: string,
    location: string,
    initial_date: string,
    final_date: string,
    federation_id: string,
    created: string,
    modified: string,
    federation: FederationModel,
    stages: StageModel[]
  }
}

export interface StageModel {
  id: string,
  description: string,
}

export interface FederationModel {
  id: string,
  description: string
}

export interface Page<T> {
  data:T[];
}