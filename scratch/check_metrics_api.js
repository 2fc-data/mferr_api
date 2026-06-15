async function run() {
  try {
    // 1. Login
    const loginRes = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) {
      console.error("Login failed:", loginData);
      return;
    }

    // Extract access_token
    // In our NestJS auth implementation, is the token returned as an access_token field or inside a cookie?
    // Let's see: the response body we got in the previous run_command was:
    // { status: 'success', data: { user: { ... } } }
    // Wait, where is the access_token?
    // In NestJS, let's check if the token is set in the Cookie header. Let's look at the response headers of the login request.
    const cookieHeader = loginRes.headers.get('set-cookie');
    console.log("Set-Cookie Header:", cookieHeader);

    // Let's also check if the response data has token. Wait, let's dump the whole login response data.
    console.log("Login Response Body:", JSON.stringify(loginData, null, 2));

    // 2. Fetch metrics
    const headers = {
      'Content-Type': 'application/json',
    };
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader.split(';')[0];
    }

    const metricsRes = await fetch('http://localhost:3000/dashboard/metrics?year=2026', {
      method: 'GET',
      headers
    });
    const metricsData = await metricsRes.json();
    console.log("Metrics Response OK?", metricsRes.ok);
    console.log("Metrics Response Body:", JSON.stringify(metricsData, null, 2));
    if (!metricsRes.ok) {
      console.error("Metrics failed:", metricsData);
      return;
    }

    const records = metricsData.data?.records || [];
    console.log(`Found ${records.length} records in dashboard metrics.`);
    
    // Find the target process
    const target = records.find(r => r.number === '4444444-44.4444.4.44.4444');
    if (target) {
      console.log("Target Process:", {
        id: target.id,
        number: target.number,
        outcome_id: target.outcome_id,
        outcome: target.outcome,
        outcome_name: target.outcome_name,
      });
    } else {
      console.log("Target process not found in records.");
      if (records.length > 0) {
        console.log("First record:", records[0]);
      }
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

run();
