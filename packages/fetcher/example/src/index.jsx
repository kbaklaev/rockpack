import React from 'react';
import ReactDOM from 'react-dom';
import { useAxios, AxiosHeaders, Axios, MockAxios } from '../../dist';

function InnerApp() {
    let axios = useAxios();

    return <div>
        <button onClick={() => axios.post('http://localhost:4000/getCookies')}>Test request</button>
    </div>
}

function App(props) {
    return <AxiosHeaders headers={{test: 'testaaa'}}>
            <Axios props={{
                baseURL: 'http://localhost:4000/',
                withCredentials: true
            }}>
                <MockAxios
                    mock={mocker => {
                        mocker.onPost('/getCookies').reply(function(config) {
                            console.log('get cookies', config);

                            return [200, {
                                users: [
                                    { id: 1, name: 'John Smith' }
                                ]
                            }];
                        });
                    }}
                >
                    <InnerApp />
                </MockAxios>
            </Axios>
    </AxiosHeaders>
}

ReactDOM.render(<App />, document.getElementById('root'));