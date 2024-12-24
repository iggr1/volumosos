        const API_KEY = 'AIzaSyDBzyQdQmP4iBtMcYK_IJHqkqixcmFFRM4';
        const CLIENT_ID = '622824117869-f5hakq5qc5redp72hnnrkhrudkkc91c1.apps.googleusercontent.com';
        const SPREADSHEET_ID = '1Ew4K6auA1XtUmShwr3Ll5a2pTHGFf0CGpiNryXN0eFg';
        const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

        let operationDate = '';
        let tokenClient;

        function enableFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log(`Erro ao tentar ativar tela cheia: ${err.message}`);
                });
            }
        }

        function initGoogleAPI() {
            gapi.load('client', async () => {
                await gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
                    scope: SCOPES,
                });
                tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: CLIENT_ID,
                    scope: SCOPES,
                    callback: '',
                });
            });
        }

        async function authenticate() {
            tokenClient.callback = async (response) => {
                if (response.error) {
                    console.error('Erro na autenticação:', response);
                    return;
                }
                console.log('Autenticado com sucesso.');
            };
            tokenClient.requestAccessToken();
        }

        async function salvarDados(codigo, cidade, pallet) {
            const values = [[codigo, cidade, pallet || '', operationDate]];

            try {
                await gapi.client.sheets.spreadsheets.values.append({
                    spreadsheetId: SPREADSHEET_ID,
                    range: 'Sheet1!A:D',
                    valueInputOption: 'USER_ENTERED',
                    resource: { values },
                });
                alert('Dados salvos com sucesso!');
            } catch (error) {
                console.error('Erro ao salvar os dados:', error);
                alert('Erro ao salvar os dados.');
            }
        }

        function verificarCodigo(cidade) {
            const codigoInput = document.getElementById('codigo').value;
            if (/^BR[A-Za-z0-9]{13}$/.test(codigoInput)) {
                salvarDados(codigoInput, cidade, null);
                alert(`Código: ${codigoInput}, Cidade: ${cidade}`);
            } else {
                alert('Código inválido ou não preenchido corretamente.');
            }
            document.getElementById('codigo').value = '';
        }

        function abrirModal() {
            const modal = document.getElementById('modal');
            const buttonsContainer = document.getElementById('modal-buttons');

            buttonsContainer.innerHTML = '';
            for (let i = 1; i <= 50; i++) {
                const button = document.createElement('button');
                button.textContent = i;
                button.onclick = () => {
                    const pallet = i;
                    const codigoBR = document.getElementById('codigo').value;
                    salvarDados(codigoBR, 'Chapecó', pallet);
                    document.getElementById('codigo').value = '';
                    fecharModal();
                };
                buttonsContainer.appendChild(button);
            }

            modal.style.display = 'flex';
        }

        function fecharModal() {
            document.getElementById('modal').style.display = 'none';
        }

        function setOperationDate() {
            const now = new Date();
            if (now.getHours() < 12) {
                now.setDate(now.getDate() - 1);
            }
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            operationDate = `${day}/${month}/${year}`;
            console.log("Data da Operação:", operationDate);
        }

        window.onload = () => {
            setOperationDate();
            initGoogleAPI();
        };