class User < ActiveRecord::Base
  acts_as_tree

  serialize :data, Hash
  belongs_to :account
  belongs_to :node
  belongs_to :role

  has_many :events, -> { where flag: false}
  has_many :flags, -> { where flag: true}, class_name:"Event"

  has_many :user_badges
  has_many :badges, :through=>:user_badges
  has_many :user_notifications
  has_many :notifications, -> {where read:nil}, class_name:'UserNotification'
  has_many :user_scores

  has_many :zero_sum_game_users
  has_many :zero_sum_games, :through=>:zero_sum_game_users

  to_info :uid, :login,:node_info, :parent_info
  def append_data(data)
    self.data.merge(data)
    self.save
  end

  def read_message(id)
    un = self.user_notifications.find(id)
    un.read = Time.now
    un.save
  end

  def node_info
    self.node.name unless self.node.nil?
  end

  def parent_info
    {:uid=>self.parent.uid, :login=>self.parent.login} unless self.parent.nil?
  end

  def vectorize(do_save=true)
    actions = {}
    self.events.each{|e|
      actions[e.code] = (actions[e.code] || 0 ) + (e.value || 0)
    }
    self.data[:vector] = actions
    self.save if do_save
    actions
  end

  def vector
    self.data[:vector] || self.vectorize
  end
  
  def distance(r)
    User.distance(self.vector,r)
  end

  def self.distance(v1,v2)
    v=v1.merge(v2){|k,vv1,vv2| ((vv1||0)-(vv2||0))**2}
    sum = 0
    v.values.each{|vv| sum+=vv}
    Math.sqrt(sum)
  end

  def spill!
    vectorize(true)
    spill
  end

  def spill
    res = self.to_info.merge({
      :node=> self.node.nil? ? nil : self.node.to_info,
      :badges=>self.badges.map{|b| b.to_info},
      :scores=>self.user_scores.map{|s| s.to_info},
      :actions=>vector.map{|k,v|{:name=>k, :value=>v}},
      :announcements=>self.notifications.reject{|n| n.notification.nil? }.map{|n| n.to_data}
    })
    res
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
    score.add added_value
    score.save
  end

  def add_badge badge
    self.badges << badge unless self.badges.include?(badge)
  end

  def remove_badge badge
    user_badge = self.user_badges.find_by_badge_id(badge.id)
    user_badge.destroy unless user_badge.nil?
  end

  def announce announcement_code
    notification = self.account.notifications.find_by_name announcement_code
    un = UserNotification.new({:data=>notification.reduce(self), :notification_id=>notification.id})
    self.user_notifications << un
  end

  def move_to_node(edge)
    self.events << Event.new({:flag=>true, :code=>"_TRANSITION", :value=>edge.id})
    self.node = edge.target
    self.save
  end

end
