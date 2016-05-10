const Router = require('express').Router;
const router = new Router();


function create<%= className %>(req, res, next) {
  req.logger.info('Creating <%= instanceName %>', req.body);

  req.model('<%= className %>').create(req.body, (err, <%= instanceName %>) => {
    if (err) { return next(err); }

    req.logger.verbose('Sending <%= instanceName %> to client');
    res.sendCreated(<%= instanceName %>);
  });
}

function query<%= className %>s(req, res, next) {
  req.logger.info('Querying <%= instanceName %>s', req.query);
  req.model('<%= className %>').countAndFind(req.query)
    .skip(req.skip)
    .limit(req.limit)
    .sort(req.sort)
    .lean()
    .exec((err, <%= instanceName %>s, <%= instanceName %>Count) => {
      if (err) { return next(err); }

      req.logger.verbose('Sending <%= instanceName %> to client');
      res.sendQueried(<%= instanceName %>s, <%= instanceName %>Count);
    });
}

function find<%= className %>ById(req, res, next) {
  req.logger.info('Finding <%= instanceName %> with id %s', req.params.id);
  req.model('<%= className %>').findById(req.params.id)
    .lean()
    .exec((err, <%= instanceName %>) => {
      if (err) { return next(err); }
      if (!<%= instanceName %>) { return res.status(404).end(); }

      req.logger.verbose('Sending <%= instanceName %> to client');
      res.sendFound(<%= instanceName %>);
    });
}

function find<%= className %>BySlug(req, res, next) {
  req.logger.info('Finding <%= instanceName %> with slug %s', req.params.slug);
  req.model('<%= className %>').findBySlug(req.params.slug)
    .lean()
    .exec((err, <%= instanceName %>) => {
      if (err) { return next(err); }
      if (!<%= instanceName %>) { return res.status(404).end(); }

      req.logger.verbose('Sending <%= instanceName %> to client');
      res.sendFound(<%= instanceName %>);
    });
}

function update<%= className %>ById(req, res, next) {
  req.logger.info('Updating <%= instanceName %> with id %s', req.params.id);
  req.model('<%= className %>').update({
    _id: req.params.id
  }, req.body, (err, results) => {
    if (err) { return next(err); }

    if (results.n < 1) {
      req.logger.verbose('<%= className %> not found');
      return res.status(404).end();
    }
    req.logger.verbose('<%= className %> updated');
    res.status(204).end();
  });
}

function remove<%= className %>ById(req, res, next) {
  req.logger.info('Removing <%= instanceName %> with id %s', req.params.id);
  req.model('<%= className %>').remove({
    _id: req.params.id
  }, (err, results) => {
    if (err) { return next(err); }

    if (results.nModified < 1) {
      req.logger.verbose('<%= className %> not found');
      return res.status(404).end();
    }
    req.logger.verbose('<%= className %> removed');
    res.status(204).end();
  });
}

function restore<%= className %>ById(req, res, next) {
  req.logger.info('Restoring <%= instanceName %> with id %s', req.params.id);
  req.model('<%= className %>').restore({
    _id: req.params.id
  }, (err, results) => {
    if (err) { return next(err); }

    if (results.nModified < 1) {
      req.logger.verbose('<%= className %> not found');
      return res.status(404).end();
    }
    req.logger.verbose('<%= className %> restored');
    res.status(204).end();
  });
}

router.post(  '/',                  create<%= className %>);
router.get(   '/',                  query<%= className %>s);
router.get(   '/:id([0-9a-f]{24})', find<%= className %>ById);
router.get(   '/:slug',             find<%= className %>BySlug);
router.put(   '/:id',               update<%= className %>ById);
router.delete('/:id',               remove<%= className %>ById);
router.post(  '/restore/:id',       restore<%= className %>ById);


module.exports = router;
