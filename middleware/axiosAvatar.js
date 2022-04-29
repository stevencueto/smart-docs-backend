const makeOptions =(name)=>{
    const options = {
        method: 'GET',
        url: 'https://initials-avatar.p.rapidapi.com/',
        params: {
          name: name,
          rounded: 'true',
          uppercase: 'true',
          'font-size': '0.5',
          length: '2',
          size: '128',
          background: '000000',
          color: 'ffffff'
        },
        headers: {
          'X-RapidAPI-Host': 'initials-avatar.p.rapidapi.com',
          'X-RapidAPI-Key': process.env.AVATAR_API_KEY
        }
      };
    return options
}
module.exports = makeOptions;