export function getCookie(cookie_name) {
    cookie_name = `${cookie_name}=`
    let cookies = decodeURIComponent(document.cookie);
    cookies = cookies.split(";");

    let cookie = "";
    for(let i = 0; i < cookies.length; i++) {
        cookie = cookies[i].trim();

        if(cookie.indexOf(cookie_name) == 0) {
            return cookie.substring(cookie_name.length, cookie.length);
        }
    }
}

export function removeToken() {
    document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function mapFields(options) {
    const object = {};
    for (let x = 0; x < options.fields.length; x++) {
      const field = [options.fields[x]];
      object[field] = {
        get() {
          return this.$store.state[options.base][field];
        },
        set(valor) {
          this.$store.commit(options.mutation, { [field]: valor });
        }
      };
    }
    
    return object;
}