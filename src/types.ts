/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Severity = 'low' | 'medium' | 'high';
export type CrowdLevel = 'normal' | 'busy' | 'overcrowded';
export type IncidentStatus = 'active' | 'resolved';
export type TaskStatus = 'pending' | 'completed';

export interface MenuItem {
  item: string;
  price: number;
  sustainable: boolean;
  co2OffsetGrams: number;
}

export interface Sector {
  id: string;
  name: string;
  crowdLevel: CrowdLevel;
  concessionType: string;
  menu: MenuItem[];
  accessibilityStatus: string;
  co2OffsetKg: number;
  sensorCount: number;
  occupancyPercent: number;
}

export interface Incident {
  id: string;
  title: string;
  sectorId: string;
  severity: Severity;
  description: string;
  status: IncidentStatus;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  sectorId: string;
  assignedTo: string;
  status: TaskStatus;
  incidentId?: string;
  translationRequired?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface TransitStatus {
  metroStatus: 'Excellent' | 'Delayed' | 'Critical Crowds';
  shuttleFrequencyMin: number;
  electricBusCount: number;
  parkAndRideOccupancy: number; // percentage
}

export interface SustainabilityMetrics {
  recycledKg: number;
  waterSavedLiters: number;
  solarEnergyKwh: number;
  reusableCupsActive: number;
}

export interface StadiumState {
  sectors: Sector[];
  incidents: Incident[];
  tasks: Task[];
  transit: TransitStatus;
  sustainability: SustainabilityMetrics;
}
