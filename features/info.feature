Feature: Info call

  Background:
    Given a running server

  Scenario:
    When I GET /api/info
    Then I see something