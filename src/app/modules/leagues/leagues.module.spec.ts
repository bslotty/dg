import { LeaguesModule } from './leagues.module';

describe('LeaguesModule', () => {
  let leaguesModule: LeaguesModule;

  beforeEach(() => {
    leaguesModule = new LeaguesModule();
  });

  it('should create an instance', () => {
    expect(leaguesModule).toBeTruthy();
  });
});
