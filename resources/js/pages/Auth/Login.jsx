import { useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post('/login');
    };

    return (
        <div>
            <h1>Log in</h1>

            <form onSubmit={submit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                    />
                    {errors.email ? <div>{errors.email}</div> :null}
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                    />
                    {errors.password ? <div>{errors.password}</div> :null}
                </div>

                <button type="submit" disabled={processing}>
                    Login
                </button>
            </form>
        </div>
    );
}
