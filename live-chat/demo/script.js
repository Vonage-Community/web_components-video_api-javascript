const liveChatEl = document.querySelector('live-chat');

let serverURL;
let applicationId = '5ca22317-fa14-4171-836f-8e3f4c5be5c9';
let sessionId = '1_MX41Y2EyMjMxNy1mYTE0LTQxNzEtODM2Zi04ZTNmNGM1YmU1Yzl-fjE3NTU2NTk1MTk1OTN-WEZ3KzZ3cS9UMUl6VGM0TklhSkJZNTUzfn5-';
let token = 'eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vYW51YmlzLWNlcnRzLWMxLXVzZTEucHJvZC52MS52b25hZ2VuZXR3b3Jrcy5uZXQvandrcyIsImtpZCI6IkNOPVZvbmFnZSAxdmFwaWd3IEludGVybmFsIENBOjoxMjU2MDc2MjMyMjI2NTE4OTU4NTE5NTkwNjI4NTA1MjIyNDg1ODQiLCJ0eXAiOiJKV1QiLCJ4NXUiOiJodHRwczovL2FudWJpcy1jZXJ0cy1jMS11c2UxLnByb2QudjEudm9uYWdlbmV0d29ya3MubmV0L3YxL2NlcnRzLzlkY2ExNmE5YjBhMDk3ZWZmMTEwNzAzYWNlNjlmODg5In0.eyJwcmluY2lwYWwiOnsiYWNsIjp7InBhdGhzIjp7Ii8qKiI6e319fSwidmlhbUlkIjp7ImVtYWlsIjoiZHdhbmUuaGVtbWluZ3MrZGFzaGJvYXJkY29tbXVuaXR5QHZvbmFnZS5jb20iLCJnaXZlbl9uYW1lIjoiRHdhbmUiLCJmYW1pbHlfbmFtZSI6IkhlbW1pbmdzIiwicGhvbmVfbnVtYmVyIjoiMTMyMTQ0NDM4NDUiLCJwaG9uZV9udW1iZXJfY291bnRyeSI6IlVTIiwib3JnYW5pemF0aW9uX2lkIjoiOTgxNDE0YTktMmZkNC00ZDE4LWIzN2ItNDhlMWQ5Y2EwMDdiIiwiYXV0aGVudGljYXRpb25NZXRob2RzIjpbeyJjb21wbGV0ZWRfYXQiOiIyMDI1LTA4LTIwVDAzOjA2OjA5LjUyNzMzOTE3NloiLCJtZXRob2QiOiJpbnRlcm5hbCJ9XSwiaXBSaXNrIjp7InJpc2tfbGV2ZWwiOjB9LCJ0b2tlblR5cGUiOiJ2aWFtIiwiYXVkIjoicG9ydHVudXMuaWRwLnZvbmFnZS5jb20iLCJleHAiOjE3NTU2NTk4MTksImp0aSI6IjljMDAyZGU4LThlNWEtNDFiOS04NWEzLTlkOGJkZDBlMzIxZiIsImlhdCI6MTc1NTY1OTUxOSwiaXNzIjoiVklBTS1JQVAiLCJuYmYiOjE3NTU2NTk1MDQsInN1YiI6IjUyODk5NTI5LTkwODMtNDkzOC05M2M4LTE1NTQ0ZWRiZWQwZSJ9fSwiZmVkZXJhdGVkQXNzZXJ0aW9ucyI6eyJ2aWRlby1hcGkiOlt7ImFwaUtleSI6ImNiMmY0MGVmIiwiYXBwbGljYXRpb25JZCI6IjVjYTIyMzE3LWZhMTQtNDE3MS04MzZmLThlM2Y0YzViZTVjOSIsImV4dHJhQ29uZmlnIjp7InZpZGVvLWFwaSI6eyJpbml0aWFsX2xheW91dF9jbGFzc19saXN0IjoiIiwicm9sZSI6Im1vZGVyYXRvciIsInNjb3BlIjoic2Vzc2lvbi5jb25uZWN0Iiwic2Vzc2lvbl9pZCI6IjFfTVg0MVkyRXlNak14TnkxbVlURTBMVFF4TnpFdE9ETTJaaTA0WlRObU5HTTFZbVUxWXpsLWZqRTNOVFUyTlRrMU1UazFPVE4tV0VaM0t6WjNjUzlVTVVsNlZHTTBUa2xoU2tKWk5UVXpmbjUtIn19fV19LCJhdWQiOiJwb3J0dW51cy5pZHAudm9uYWdlLmNvbSIsImV4cCI6MTc1NjI2NDQyMiwianRpIjoiMjBjZDFhNTUtMDg2ZS00YWFiLWFkNTYtZGM3MWExZTg3YTJhIiwiaWF0IjoxNzU1NjU5NjIyLCJpc3MiOiJWSUFNLUlBUCIsIm5iZiI6MTc1NTY1OTYwNywic3ViIjoiNTI4OTk1MjktOTA4My00OTM4LTkzYzgtMTU1NDRlZGJlZDBlIn0.nrUAu6ImD8W9FkrZiUxxNPDReKFyUbaMbnODox-Iga1WciYV6LRwrIJieqbeLsvKMbI07R3KSqhSssBHCL6j6JM7B4C3lSBXWgtSbzDXFeRUjJc2k2M4DfmkgPnc2OpR8kI_2V1U0GkjGT6GaBv25MWxijSXMALP0BFWGAxj9Qpio8mTVPQoU4vCNg86uzZE-368G9ntpzMscbD9QC7f0CtMe20BDsflJhYICgTGGthJVHV3BgnnsuZJNQK0qkf9e6laOw3I8tHHo4-S1t_CY1hWhSpNw0n74bBskZ2fPjwGrmvsUWZeItdpWESdJfhsrb9qrkMqNCIOsvGjqX6uCg';

function initializeSession() {
  const session = OT.initSession(applicationId, sessionId);
  // Set session and token (and optionally properties) for Web Components
  liveChatEl.session = session;
  liveChatEl.token = token;
  liveChatEl.username = 'Alice';
}


if (serverURL){
  const fetchCredentials = async () => {
    try {
      const response = await fetch(serverURL+ '/session');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const credentials = await response.json();
      applicationId = credentials.applicationId;
      sessionId = credentials.sessionId;
      token = credentials.token;
      initializeSession();
    } catch (err) {
      console.error('Error getting credentials: ', err.message);
    }
  };
  fetchCredentials();
} else {
  initializeSession();
};
