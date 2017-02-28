export default (req, res, next) => {
  const authToken = req.get('Authorization') || '';
  const userToken = authToken.split(' ')[1] || '';
  const bearer = authToken.split(' ')[0];
  if (bearer !== 'Bearer') {
    return Response.unAuthorize(res, 'Authorization Bearer not found');
  }
  db.Token.findOne({
    where: {
      token_hash: Crypto.createHash('md5').update(userToken).digest('hex')
    }
  })
  .then((token) => {
    if (!token) {
      throw new Error('You are not Authorize to access this route');
    }
    req.user = jwt.verify(userToken, 'enahomurphy');
    req.token = userToken;
    next();
  })
  .catch(err => Response.unAuthorize(res, err.message));
};