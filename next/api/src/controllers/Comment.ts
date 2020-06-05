import { ErrorProxy } from '../errors/errors';
import { ok } from '../utils/response';
import { CommentRepository } from '../repositories/Comment';
import { CommentService } from '../services/Comment';

export class CommentController {
  static fetch = async (ctx): Promise<void> => {
    const { postId } = ctx.params;

    try {
      const comments = await CommentRepository.fetchComments(postId);

      ctx.body = ok('Comments fetched', comments.map(c => c.toJSON()));
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  static create = async (ctx): Promise<void> => {
    const { postId } = ctx.params;
    const { text } = ctx.request.body;
    const userId = ctx.user.get('id');

    try {
      const comment = await CommentService.createComment(userId, postId, text);

      ctx.body = ok('Comment created', {
        id: comment.get('id')
      });
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  static delete = async (ctx): Promise<void> => {
    const { id } = ctx.params;

    try {
      await CommentService.deleteComment(id);

      ctx.body = ok('Comment deleted', {
        id
      });
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };

  static update = async (ctx): Promise<void> => {
    const { postId } = ctx.params;
    const { text } = ctx.request.body;
    const userId = ctx.user.get('id');

    try {
      const comment = await CommentService.updateComment(userId, postId, text);

      ctx.body = ok('Comment updated', {
        id: comment.get('id')
      });
    } catch (e) {
      throw new ErrorProxy(e);
    }
  };
}
