class User < ActiveRecord::Base
  acts_as_tree
  belongs_to :account
  belongs_to :node
  belongs_to :role
  has_many :events
  has_many :user_badges
  has_many :badges, :through=>:user_badges
  has_many :user_notifications
  has_many :user_scores

  to_info :uid, :login,:node_info, :parent_info
  def node_info
    self.node.name unless self.node.nil?
  end

  def parent_info
    {:uid=>self.parent.uid, :login=>self.parent.login} unless self.parent.nil?
  end

  def spill
    actions = self.events.map{|e| e.code}.uniq
    actions = actions.map{|a| 
      sum = 0
      self.events.select{|e| e.code==a}.each{|e| sum+=(e.value.nil? ? 0 : e.value)}
      {:code=>a, :value=>sum}
    }
    self.to_info.merge({
      :node=> self.node.nil? ? nil : self.node.to_info,
      :badges=>self.badges.map{|b| b.to_info},
      :scores=>self.user_scores.map{|s| s.to_info},
      :actions=>actions,
      :announcements=>self.user_notifications{|n| n.to_info}
    })
  end

  def resolve_event(code,value)
    unless code.nil? || code.empty? || value.nil? || value.empty?
      last_event = Event.create(:code=>code, :value=>value)
      self.events << last_event
      self.node.nil? ? nil : self.node.evaluate(self,last_event)
    end
  end

  ########################################################################

  def has_badge_named? badge_code
    self.badges.map{|b| b.name}.include?(badge_code)
  end

  def score scale
    if score = self.user_scores.find_by_scale_id(scale.id)
      score.value
    else
      0
    end
  end

  ########################################################################

  def upset_scale scale, added_value
    score = self.user_scores.find_by_scale_id(scale.id) || UserScore.new(scale_id:scale.id, user_id:self.id, value:0)
    score.value += added_value
    score.save
  end

  def add_badge badge
    self.badges << badge unless self.badges.include?(badge)
  end

  def remove_badge badge
    user_badge = self.user_badges.find_by_badge_id(badge.id)
    user_badge.destroy unless user_badge.nil?
  end

  def announce channel, announcement_code
    self.notifications << render(channel,self.account.notifications.find_by_name(announcement_code))
  end

  def render_announcement channel, notification
    self.user_notifications << notification.reduce(channel, seld.local)
  end

  def move_to_node(node)
    self.node = node
    self.save
  end

end
