import { TestBed } from '@angular/core/testing';
import { ProfileMatcherService } from './profile-matcher.service';

describe('ProfileMatcherService', () => {
  let service: ProfileMatcherService;

  beforeEach(() => service = TestBed.inject(ProfileMatcherService));

  it('normalizes a profile to one', () => {
    const result = service.normalize({
      professore_alfa: 2, romeo_giulietta: 2, eros_trilli: 4, valium_scheggia: 0
    });
    expect(Object.values(result).reduce((sum, value) => sum + value, 0)).toBeCloseTo(1);
    expect(result.eros_trilli).toBe(.5);
  });

  it('identifies primary and secondary archetypes deterministically', () => {
    const profile = service.analyze({
      professore_alfa: 7, romeo_giulietta: 5, eros_trilli: 2, valium_scheggia: 1
    });
    expect(profile.primary).toBe('professore_alfa');
    expect(profile.secondary).toBe('romeo_giulietta');
  });

  it('matches the complete vector without a primary-archetype shortcut', () => {
    const actors = [
      {
        name: 'Same primary, distant vector', imdbId: '1', primaryEmotion: 'Romeo',
        emotions: { Romeo: .7, Professore: .1, Eros: .1, Scheggia: .1 }
      },
      {
        name: 'Different primary, closest vector', imdbId: '2', primaryEmotion: 'Professore',
        emotions: { Romeo: .31, Professore: .32, Eros: .22, Scheggia: .15 }
      }
    ];
    const matches = service.rankActors({
      professore_alfa: .3, romeo_giulietta: .32, eros_trilli: .22, valium_scheggia: .16
    }, actors);
    expect(matches[0].name).toBe('Different primary, closest vector');
  });

  it('builds one deterministic, unique actor match for every archetype', () => {
    const actors = [
      { name: 'P', imdbId: '1', primaryEmotion: 'Professore', emotions: { Professore: .7, Romeo: .1, Eros: .1, Scheggia: .1 } },
      { name: 'R', imdbId: '2', primaryEmotion: 'Romeo', emotions: { Professore: .1, Romeo: .7, Eros: .1, Scheggia: .1 } },
      { name: 'E', imdbId: '3', primaryEmotion: 'Eros', emotions: { Professore: .1, Romeo: .1, Eros: .7, Scheggia: .1 } },
      { name: 'S', imdbId: '4', primaryEmotion: 'Scheggia', emotions: { Professore: .1, Romeo: .1, Eros: .1, Scheggia: .7 } }
    ];
    const cast = service.buildEmotionalCast({
      professore_alfa: .25, romeo_giulietta: .25, eros_trilli: .25, valium_scheggia: .25
    }, actors);
    expect(Object.keys(cast).length).toBe(4);
    expect(new Set(Object.values(cast).map(actor => actor.name)).size).toBe(4);
  });
});
