Feature: Info call

  Scenario: One
    Given a running server
    When I GET /api/info
    Then I see something
